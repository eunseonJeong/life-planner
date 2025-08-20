import { createClientComponentClient, createServerComponentClient, createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"

export const createClient = () => createClientComponentClient()
export const createServerClient = () => createServerComponentClient({ cookies })
export const createMiddleware = (opts: { req: NextRequest; res: NextResponse }) => createMiddlewareClient({ ...opts })
