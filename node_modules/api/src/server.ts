const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { router: authRouter } = require('./routes/auth');
const { router: adminRouter } = require('./routes/admin');
const { router: storeRouter } = require('./routes/stores');
const { router: ownerRouter } = require('./routes/owner');
const { errorHandler } = require('./utils/errorHandler');
const { buildSwaggerSpec } = require('./utils/swagger');

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

import { Request, Response } from 'express';

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/', storeRouter);
app.use('/owner', ownerRouter);

const swaggerSpec = buildSwaggerSpec();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

