import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const xssArr = ["script", "prompt", "alert", "iframe", "javascript", "setInterval", "slice", "find", "vibrate", "code", "source","window"]
export default function middleware(request: NextRequest) {

  const nextUrl = request.nextUrl
  xssArr.forEach((xssStr) => {
    if (nextUrl.search.includes(xssStr)) {
      nextUrl.search = ""
      nextUrl.href = nextUrl.href.replace(/script[\s\S]*?script/g, "")
      nextUrl.pathname = '/'
      return
    }
  })

   // Access Control based on localStorage data
  //  const { pathname } = request.nextUrl;
  //  if (typeof window !== 'undefined') {
  //   const privilegesArray = JSON.parse(localStorage.getItem('roleInfo') || '[]');
  //   const screenData = privilegesArray.find((screen:any) => screen.path === pathname);

  //   if (!screenData) {
  //     return NextResponse.redirect('/'); // Redirect if screen data not found
  //   }
  // }
  
  return NextResponse.rewrite(nextUrl)
}
 
