import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data } = await supabase.auth.getUser()
    const user = data?.user

    const isPublicRoute = 
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/about') ||
      request.nextUrl.pathname.startsWith('/explorer') ||
      request.nextUrl.pathname.startsWith('/verify') ||
      request.nextUrl.pathname.startsWith('/signin') ||
      request.nextUrl.pathname.startsWith('/news') ||
      request.nextUrl.pathname.startsWith('/public-test') ||
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.startsWith('/auth') ||
      request.nextUrl.pathname.startsWith('/portal') ||
      request.nextUrl.pathname.startsWith('/reputation') ||
      request.nextUrl.pathname.startsWith('/legal');

    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (e) {
    console.error("[Middleware] Critical Error:", e);
    return NextResponse.next({ request });
  }
}
