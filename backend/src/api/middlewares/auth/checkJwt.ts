import { auth } from "express-oauth2-jwt-bearer";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;

function checkJwt() {
	if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE)
		throw new Error("Auth0 config not found");

	return auth({
		issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
		audience: AUTH0_AUDIENCE,
		tokenSigningAlg: "RS256",
	});
}

export default checkJwt;
