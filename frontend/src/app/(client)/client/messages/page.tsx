'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { ChatThread, ChatMessage, ChatParticipant, WorkerInfo } from '../../../../types';
import {
  fetchChatThreadsApi,
  fetchThreadMessagesApi,
  sendChatMessageApi,
  inviteWorkerToThreadApi,
  createNewThreadApi
} from '../../../../lib/api';
import {
  MessageSquare,
  Send,
  UserPlus,
  Paperclip,
  CheckCircle2,
  Clock,
  Shield,
  Wrench,
  User,
  Plus,
  X,
  Loader2,
  ImageIcon,
  Sparkles,
  Search,
  MessageCircle,
  Camera
} from 'lucide-react';
import CameraCaptureModal from '../../../../components/CameraCaptureModal';

export default function ClientMessagesPage() {
  const { currentUser, workers, projects } = useApp();

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const [inputText, setInputText] = useState<string>('');
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  
  const [isLoadingThreads, setIsLoadingThreads] = useState<boolean>(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // Camera Modal state
  const [showCameraModal, setShowCameraModal] = useState<boolean>(false);

  // Invite Worker Modal state
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [isInviting, setIsInviting] = useState<boolean>(false);

  // New Thread Modal state
  const [showNewThreadModal, setShowNewThreadModal] = useState<boolean>(false);
  const [newThreadTitle, setNewThreadTitle] = useState<string>('');
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);

  // Plus action menu state
  const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Chat Threads on load
  const loadThreads = async () => {
    setIsLoadingThreads(true);
    try {
      const data = await fetchChatThreadsApi();
      if (data && data.length > 0) {
        setThreads(data);
        if (!selectedThreadId) {
          setSelectedThreadId(data[0].id);
        }
      } else {
        setThreads([]);
        setSelectedThreadId('');
      }
    } catch (err) {
      console.warn('Error loading chat threads:', err);
    } finally {
      setIsLoadingThreads(false);
    }
  };

  useEffect(() => {
    loadThreads();
  }, []);

  // 2. Fetch Messages when active thread changes
  const loadMessages = async (threadId: string) => {
    if (!threadId) return;
    setIsLoadingMessages(true);
    try {
      const data = await fetchThreadMessagesApi(threadId);
      setMessages(data || []);
    } catch (err) {
      console.warn('Error fetching thread messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedThreadId) {
      loadMessages(selectedThreadId);
    }
  }, [selectedThreadId]);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  // 3. Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && attachmentUrls.length === 0) || isSending || !selectedThreadId) return;

    const contentToSend = inputText.trim() || 'Attached Photo Evidence';
    const photosToSend = [...attachmentUrls];

    // Optimistic UI update
    const optimisticMsg: ChatMessage = {
      id: `msg-opt-${Date.now()}`,
      threadId: selectedThreadId,
      senderId: currentUser?.id || 'user-client-1',
      senderName: currentUser?.name || 'Michael Thompson',
      senderRole: 'client',
      content: contentToSend,
      attachmentUrls: photosToSend,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    setAttachmentUrls([]);
    setIsSending(true);

    try {
      await sendChatMessageApi(
        selectedThreadId,
        currentUser?.id || 'user-client-1',
        currentUser?.name || 'Michael Thompson',
        'client',
        contentToSend,
        photosToSend
      );
      // Refresh thread list to update last message
      loadThreads();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  // 4. Handle Cloudinary Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

    try {
      const uploaded: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('image', files[i]);
        formData.append('folder', 'ojutu/chat-attachments');

        const res = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success && data.url) {
          uploaded.push(data.url);
        } else {
          // Fallback to data URI if needed
          const reader = new FileReader();
          const dataUri = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(files[i]);
          });
          uploaded.push(dataUri);
        }
      }
      setAttachmentUrls(prev => [...prev, ...uploaded]);
    } catch (err) {
      console.error('Error uploading photo:', err);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // 5. Handle Invite Worker to Active Thread
  const handleInviteWorker = async (worker: WorkerInfo) => {
    if (!selectedThreadId) return;
    setIsInviting(true);

    try {
      await inviteWorkerToThreadApi(
        selectedThreadId,
        worker.id,
        worker.name,
        'worker',
        worker.roleTitle || 'Field Technician',
        worker.avatarUrl
      );

      // Reload active thread and messages
      await loadThreads();
      await loadMessages(selectedThreadId);
      setShowInviteModal(false);
    } catch (err) {
      console.error('Error inviting worker:', err);
    } finally {
      setIsInviting(false);
    }
  };

  // 6. Handle Create New Thread
  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) return;

    setIsCreatingThread(true);
    try {
      const created = await createNewThreadApi(
        newThreadTitle.trim(),
        undefined,
        currentUser?.id || 'user-client-1',
        currentUser?.name || 'Michael Thompson'
      );

      setNewThreadTitle('');
      setShowNewThreadModal(false);
      await loadThreads();
      if (created && created.id) {
        setSelectedThreadId(created.id);
      }
    } catch (err) {
      console.error('Error creating thread:', err);
    } finally {
      setIsCreatingThread(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Multi-Party Direct Messaging</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-emerald-600" />
            <span>Messages & Support</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Direct real-time communication between Homeowners, Ojutu Dispatch Admin, and assigned Field Technicians.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewThreadModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Main Messaging Layout Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        
        {/* Left Sidebar: Threads List (4 cols on lg) */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Conversations ({threads.length})</span>
            </span>
            {isLoadingThreads && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[220px] lg:max-h-[560px]">
            {threads.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">No active chat threads</p>
                <p className="text-[11px] text-slate-400">Click "New Discussion Thread" above to start a conversation.</p>
              </div>
            ) : (
              threads.map(thread => {
                const isSelected = thread.id === selectedThreadId;
                const hasWorker = thread.participants?.some(p => p.role === 'worker');

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full p-4 text-left transition-all flex flex-col gap-2 relative ${
                      isSelected
                        ? 'bg-white shadow-xs border-l-4 border-l-emerald-600'
                        : 'hover:bg-slate-100/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-xs font-bold line-clamp-1 ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {thread.title}
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1 font-medium">
                      {thread.lastMessage || 'No messages yet...'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold">
                          {thread.participants?.length || 2} members
                        </span>
                        {hasWorker && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-0.5">
                            <Wrench className="w-2.5 h-2.5" />
                            <span>Tech</span>
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{thread.lastMessageTime ? new Date(thread.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}</span>
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Chat Area (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          
          {/* Thread Active Header & Participants Bar */}
          {activeThread ? (
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  {activeThread.title}
                </h2>

                {/* Active Participants Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 mr-1">Participants:</span>
                  {activeThread.participants?.map(p => (
                    <span
                      key={p.userId}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.role === 'admin'
                          ? 'bg-slate-900 text-white border-slate-800'
                          : p.role === 'worker'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      }`}
                    >
                      {p.role === 'admin' ? (
                        <Shield className="w-3 h-3 text-amber-400" />
                      ) : p.role === 'worker' ? (
                        <Wrench className="w-3 h-3 text-indigo-600" />
                      ) : (
                        <User className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>{p.name} ({p.roleTitle || p.role})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Invite Worker Button */}
              <button
                type="button"
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite Technician</span>
              </button>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 text-xs font-bold text-slate-500">
              No active thread selected
            </div>
          )}

          {/* Messages Feed */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[420px] min-h-[380px] bg-dashboard-doodle">
            {isLoadingMessages ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <span className="text-xs font-semibold">Loading conversation thread...</span>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No messages yet. Start the conversation below!
              </div>
            ) : (
              messages.map(msg => {
                const isMe = msg.senderId === (currentUser?.id || 'user-client-1') || msg.senderRole === 'client';
                const isAdmin = msg.senderRole === 'admin';
                const isWorker = msg.senderRole === 'worker';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-lg ${
                      isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    {/* Sender Tag */}
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[11px] font-bold text-slate-700">
                        {msg.senderName}
                      </span>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 text-[9px] font-extrabold flex items-center gap-0.5">
                          <Shield className="w-2.5 h-2.5" />
                          <span>Dispatch</span>
                        </span>
                      )}
                      {isWorker && (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[9px] font-extrabold flex items-center gap-0.5 border border-indigo-200">
                          <Wrench className="w-2.5 h-2.5" />
                          <span>Technician</span>
                        </span>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-3.5 rounded-2xl shadow-xs text-xs space-y-2 ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-tr-none'
                          : isAdmin
                          ? 'bg-slate-900 text-slate-100 rounded-tl-none border border-slate-800'
                          : 'bg-white text-slate-800 rounded-tl-none border border-indigo-100 shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                      {/* Photo Attachments inside Chat Bubble */}
                      {msg.attachmentUrls && msg.attachmentUrls.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {msg.attachmentUrls.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-lg overflow-hidden border border-white/20 aspect-video hover:opacity-90 transition-opacity"
                            >
                              <img src={url} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}

                      <span className={`text-[10px] block text-right font-medium ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Photo Preview Strip before sending */}
          {attachmentUrls.length > 0 && (
            <div className="p-3 bg-emerald-50/80 border-t border-emerald-200 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 shrink-0">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photos Attached ({attachmentUrls.length}):</span>
              </span>
              {attachmentUrls.map((url, idx) => (
                <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-300 shrink-0">
                  <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setAttachmentUrls(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 bg-slate-900/80 text-white rounded-full p-0.5 hover:bg-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Controls Footer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2 relative">
            
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={isUploadingPhoto}
              className="hidden"
            />

            {/* Plus (+) Action Menu Popover Container */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setShowPlusMenu(prev => !prev)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  showPlusMenu
                    ? 'bg-emerald-600 text-white rotate-45 shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
                title="Add Media / Attachments"
              >
                <Plus className="w-5 h-5 transition-transform" />
              </button>

              {/* Action Popover Menu */}
              {showPlusMenu && (
                <div className="absolute bottom-14 left-0 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 w-56 space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlusMenu(false);
                      setShowCameraModal(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 font-bold text-xs flex items-center gap-2.5 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <span>Take Picture with Camera</span>
                      <span className="text-[10px] font-normal text-slate-400 block">Live device viewfinder</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPlusMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-2.5 transition-colors text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div>
                      <span>Upload Photo from File</span>
                      <span className="text-[10px] font-normal text-slate-400 block">Select from gallery</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Uploading Indicator Badge */}
            {isUploadingPhoto && (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                <span>Uploading...</span>
              </span>
            )}

            {/* Message Input */}
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type your message to dispatch or technician..."
              className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending || (!inputText.trim() && attachmentUrls.length === 0)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

      {/* Invite Worker Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Invite Field Technician</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select an assigned technician to add them to this direct conversation thread:
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {workers.map(worker => {
                const isAlreadyIn = activeThread?.participants?.some(p => p.userId === worker.id);

                return (
                  <div
                    key={worker.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {worker.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{worker.name}</h4>
                        <p className="text-[10px] text-slate-500">{worker.roleTitle || 'Plumbing Technician'}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isAlreadyIn || isInviting}
                      onClick={() => handleInviteWorker(worker)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isAlreadyIn
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      {isAlreadyIn ? 'In Thread' : 'Invite'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <form onSubmit={handleCreateThread} className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-extrabold text-slate-900">Start New Discussion</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewThreadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Thread Subject / Topic
              </label>
              <input
                type="text"
                required
                value={newThreadTitle}
                onChange={e => setNewThreadTitle(e.target.value)}
                placeholder="e.g. Inquiry regarding roof inspection project..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNewThreadModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingThread || !newThreadTitle.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCreatingThread ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Thread'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onPhotoCaptured={(url) => setAttachmentUrls(prev => [...prev, url])}
        folder="ojutu/chat-attachments"
      />

    </div>
  );
}
