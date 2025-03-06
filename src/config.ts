import dotenv from 'dotenv';

dotenv.config();

const {
    API_URL,
    STG_API_URL,
    JWT_SECRET,
    USE_MOCKS,
    NODE_ENV
} = process.env;

const apiUrl = NODE_ENV === 'staging' ? STG_API_URL : API_URL;
const useMocks = USE_MOCKS === 'true';

export { apiUrl as API_URL, JWT_SECRET, useMocks as USE_MOCKS };
