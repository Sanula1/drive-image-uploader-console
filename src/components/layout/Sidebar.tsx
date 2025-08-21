import {
  Home,
  LayoutDashboard,
  Settings,
  User2,
  Users,
  Building,
  Calendar,
  Book,
  Bell,
  HelpCircle,
  LogOut,
  PanelLeft,
  Wallet,
} from "lucide-react"
import * as React from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"
import { useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

interface SidebarProps {
  collapsed?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setOpen } = useSidebar()
  const isMobile = useIsMobile()

  const menuItems = React.useMemo(() => {
    const items = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        children: [],
      },
      {
        id: "users",
        label: "Users",
        icon: Users,
        children: [],
      },
      {
        id: "institutes",
        label: "Institutes",
        icon: Building,
        children: [],
      },
      {
        id: "classes",
        label: "Classes",
        icon: Book,
        children: [],
      },
      {
        id: "subjects",
        label: "Subjects",
        icon: Book,
        children: [],
      },
      {
        id: "attendance",
        label: "Attendance",
        icon: Calendar,
        children: [],
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        children: [],
      },
      {
        id: "profile",
        label: "Profile",
        icon: User2,
        children: [],
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        children: [],
      },
      {
        id: "help",
        label: "Help",
        icon: HelpCircle,
        children: [],
      },
    ]

    if (user?.userType === "InstituteAdmin") {
      return items
    }

    if (user?.userType === "Teacher") {
      return items.filter(
        (item) =>
          item.id === "dashboard" ||
          item.id === "attendance" ||
          item.id === "notifications" ||
          item.id === "profile" ||
          item.id === "help" ||
		  item.id === "payment"
      )
    }

    if (user?.userType === "Student") {
      return items.filter(
        (item) =>
          item.id === "dashboard" ||
          item.id === "notifications" ||
          item.id === "profile" ||
          item.id === "help" ||
		  item.id === "payment"
      )
    }

    return items
  }, [user])

  const profileItems = React.useMemo(
    () => [
      {
        id: "profile",
        label: "Profile",
        icon: User2,
        action: () => {
          navigate("/profile")
        },
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        action: () => {
          navigate("/settings")
        },
      },
      {
        id: "logout",
        label: "Logout",
        icon: LogOut,
        action: async () => {
          await logout()
          toast({
            title: "Logged out",
            description: "You have been logged out successfully.",
          })
          navigate("/login")
        },
      },
    ],
    [logout, navigate, toast]
  )

  const renderMenuItem = (item: any, path: string = '') => {
    const fullPath = path ? `${path}/${item.id}` : `/${item.id}`;
    const isActive = location.pathname === fullPath;
    
    // Special handling for payment route
    if (item.id === 'payment') {
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton asChild isActive={isActive}>
            <NavLink 
              to="/payment" 
              className={({ isActive }) => 
                `flex items-center gap-3 ${isActive ? 'bg-accent text-accent-foreground' : ''}`
              }
            >
              <Wallet className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }

    if (item.children && item.children.length > 0) {
      return (
        <React.Fragment key={item.id}>
          <SidebarMenuItem>
            <SidebarMenuButton data-state="open">
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </SidebarMenuButton>
            <SidebarMenuAction>
              {/* Add your action here */}
            </SidebarMenuAction>
          </SidebarMenuItem>
          <SidebarMenuSub>
            {item.children.map((child: any) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton
                  to={`${fullPath}/${child.id}`}
                  asChild
                >
                  <NavLink
                    to={`${fullPath}/${child.id}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`
                    }
                    onClick={() => isMobile && setOpen(false)}
                  >
                    {child.label}
                  </NavLink>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </React.Fragment>
      )
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton asChild isActive={isActive}>
          <NavLink
            to={fullPath}
            className={({ isActive }) =>
              `flex items-center gap-3 ${
                isActive ? "bg-accent text-accent-foreground" : ""
              }`
            }
            onClick={() => isMobile && setOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <div className="flex h-full min-h-screen flex-col">
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-4 px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.imageUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col space-y-1">
              <span className="font-semibold">{user?.name}</span>
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
          )}
        </div>
        <Separator className="bg-secondary/30" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => renderMenuItem(item))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Separator className="bg-secondary/30" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-10 w-full items-center justify-between rounded-sm px-3"
            >
              {!collapsed && (
                <>
                  <span>My profile</span>
                  <User2 className="mr-2 h-4 w-4" />
                </>
              )}
              {collapsed && <User2 className="mr-2 h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {profileItems.map((item) => (
              <DropdownMenuItem key={item.id} onClick={item.action}>
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await logout()
                toast({
                  title: "Logged out",
                  description: "You have been logged out successfully.",
                })
                navigate("/login")
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </div>
  )
}

export default Sidebar
