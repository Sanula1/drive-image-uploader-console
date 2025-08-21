
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
import { 
  Sidebar as SidebarRoot,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
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
import { useToast } from "@/components/ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const menuItems = React.useMemo(() => {
    const items = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        id: "users",
        label: "Users",
        icon: Users,
        path: "/users",
      },
      {
        id: "institutes",
        label: "Institutes",
        icon: Building,
        path: "/institutes",
      },
      {
        id: "classes",
        label: "Classes",
        icon: Book,
        path: "/classes",
      },
      {
        id: "subjects",
        label: "Subjects",
        icon: Book,
        path: "/subjects",
      },
      {
        id: "attendance",
        label: "Attendance",
        icon: Calendar,
        path: "/attendance",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: Bell,
        path: "/notifications",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User2,
        path: "/profile",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
      {
        id: "help",
        label: "Help",
        icon: HelpCircle,
        path: "/help",
      },
    ]

    // Add payment item for specific user types
    if (user?.userType === "InstituteAdmin" || user?.userType === "Teacher" || user?.userType === "Student") {
      items.splice(-3, 0, {
        id: "payment",
        label: "Payment",
        icon: Wallet,
        path: "/payment",
      })
    }

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

  const handleLogout = async () => {
    await logout()
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
    navigate("/login")
  }

  return (
    <SidebarRoot>
      <SidebarHeader className="border-b">
        <div className="flex items-center space-x-4 px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.imageUrl} alt={user?.name} />
            <AvatarFallback>{user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <span className="font-semibold">{user?.name}</span>
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>
        <Separator className="bg-secondary/30" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
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
              <span>My profile</span>
              <User2 className="mr-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </SidebarRoot>
  )
}

export default Sidebar
