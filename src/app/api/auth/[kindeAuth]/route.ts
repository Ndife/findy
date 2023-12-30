import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, {params}: Params) {
	const endpoint = params.kindeAuth;
	return handleAuth(request, endpoint);
}

