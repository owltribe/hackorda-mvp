"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbNav() {
  const pathname = usePathname()

  const pathSegments = pathname
    .split("/")
    .filter(Boolean) // убираем пустые строки
    .map((segment, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/")
      const isLast = index === array.length - 1
      const label = decodeURIComponent(segment.charAt(0).toUpperCase() + segment.slice(1))
      return { href, label, isLast }
    })

  return (
    <Breadcrumb className="flex place-content-start">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map(({ href, label, isLast }) => (
          <div key={href} className="flex items-center">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
