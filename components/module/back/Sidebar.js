import Link from 'next/link'
import React from 'react'

function Sidebar({ logout }) {
  return (
    <aside>
        <ul>
            <li><Link href="/nxt-admin/blogs">بلاگ</Link></li>
            <li><Link href="/nxt-admin/barbers">آرایشگرها</Link></li>
            <li><Link href="/nxt-admin/categories">دسته بندی خدمات</Link></li>
            <li><Link href="/nxt-admin/services">خدمات</Link></li>
            <li><Link href="/nxt-admin/slots">زمان های خالی</Link></li>
            <li><button onClick={() => logout()}>خروج</button></li>
        </ul>
    </aside>
  )
}

export default Sidebar