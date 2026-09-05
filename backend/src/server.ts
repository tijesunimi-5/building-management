import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'ApexCare Property Maintenance API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Demo Data Routes
app.get('/api/v1/properties', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'prop-1',
        name: 'Thompson Residence',
        address: '142 Yorkville Ave',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5R 1C2',
        propertyType: 'SINGLE_FAMILY',
        clientName: 'Michael Thompson'
      },
      {
        id: 'prop-2',
        name: 'Williams Family Home',
        address: '88 Forest Hill Rd',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M4V 2L7',
        propertyType: 'SINGLE_FAMILY',
        clientName: 'Sarah Williams'
      },
      {
        id: 'prop-3',
        name: 'Anderson Property',
        address: '320 Bay St, Suite 1400',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5H 4A6',
        propertyType: 'CONDO',
        clientName: 'David Anderson'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`ApexCare Backend API running on port ${PORT}`);
});
