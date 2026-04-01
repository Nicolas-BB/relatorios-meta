import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt_token')?.value;

  // Protect all paths except auth APIs, login page and static files
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/auth') || request.nextUrl.pathname === '/login';
  const isStaticFile = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/favicon.ico');

  if (isStaticFile) {
    return NextResponse.next();
  }

  // Se o usuário está tentando acessar login/auth e já tem token válido, manda pro dashboard
  if (isAuthRoute) {
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
        await jwtVerify(token, secret);
        // Token é válido, não precisa logar de novo
        if (request.nextUrl.pathname === '/login') {
          return NextResponse.redirect(new URL('/saldos', request.url));
        }
      } catch (err) {
        // Token inválido, segue o fluxo para o login
      }
    }
    return NextResponse.next();
  }

  // Redirecionamento principal: sem validação real = manda pra tela de login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret');
    await jwtVerify(token, secret);

    // Se acessou a raiz '/', leva para o dashboard
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/saldos', request.url));
    }

    // Segue viagem
    return NextResponse.next();
  } catch (error) {
    // Token corrompido ou expirado
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('jwt_token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
