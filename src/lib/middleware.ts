import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    // Web3 applications typically handle authorization on the client side
    // We keep the middleware minimal to avoid overhead
    return NextResponse.next({
      request,
    })
  } catch (e) {
    console.error("[Middleware] Critical Error:", e);
    return NextResponse.next({ request });
  }
}
