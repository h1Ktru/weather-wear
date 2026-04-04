import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // ① アクセスしてきた人が持っている「鍵（認証情報）」を取得
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    // ② 鍵のデータ（Base64という暗号）を解読して、IDとパスワードを取り出す
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // ③ 環境変数に設定した正しいID・パスワードと一致するかチェック！
    if (
      user === process.env.BASIC_AUTH_USER &&
      pwd === process.env.BASIC_AUTH_PASSWORD
    ) {
      // 一致したら通してあげる
      return NextResponse.next();
    }
  }

  // ④ 鍵を持っていない、または間違っている場合は「パスワード入力画面」を強制的に出す
  return new NextResponse("認証が必要です（Auth required）", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

// ⑤ この門番をどのページに配置するか（今回はすべてのページ '/:path*'）
export const config = {
  matcher: "/:path*",
};
