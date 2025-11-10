// server.js
import { requiredScopes } from "express-oauth2-jwt-bearer";

const checkScopes = requiredScopes("games:authorized");

export default checkScopes;
