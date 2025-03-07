import Link from 'next/link'
import React from 'react'

function Sidebar({ logout }) {
  return (
    <aside>
        <ul>
            <li><Link href="/nxt-admin/blogs">بلاگ</Link></li>
            <li><button onClick={() => logout()}>خروج</button></li>
        </ul>
    </aside>
  )
}

export default Sidebar