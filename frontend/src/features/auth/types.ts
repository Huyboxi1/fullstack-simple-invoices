import { type LinkProps } from '@tanstack/react-router'

export interface User {
  email: string
  id: number
  fullname: string
}

export interface SignInFormValues {
  email: string
  password: string
}

export interface SignInReq {
  email: string
  password: string
}

export interface SignInRes {
  accessToken: string
}

export interface BaseNavItem {
  title: string
  badge?: string
  icon?: React.ElementType
}

export type NavLink = BaseNavItem & {
  url: LinkProps['to']
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface SidebarData {
  navGroups: NavGroup[]
}
