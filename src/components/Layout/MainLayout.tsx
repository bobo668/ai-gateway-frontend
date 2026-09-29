import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Button, theme } from 'antd'
import {
  DashboardOutlined,
  CloudServerOutlined,
  TeamOutlined,
  KeyOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
  ApiOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { useAppStore } from '@/stores/appStore'
import MobileSidebar from './MobileSidebar'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表板' },
  { key: '/providers', icon: <CloudServerOutlined />, label: '服务商管理' },
  { key: '/consumers', icon: <TeamOutlined />, label: '消费者管理' },
  { key: '/policies', icon: <SafetyOutlined />, label: '访问策略' },
  { key: '/ratelimits', icon: <ThunderboltOutlined />, label: '限流配置' },
  { key: '/call-records', icon: <HistoryOutlined />, label: '调用记录' },
  { key: '/mcp', icon: <ApiOutlined />, label: 'MCP工具' },
  { key: '/reports', icon: <BarChartOutlined />, label: '成本报表' },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()
  const { token } = theme.useToken()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人信息' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isMobile && (
        <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      )}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        breakpoint="lg"
        collapsedWidth={80}
        onCollapse={(collapsed) => useAppStore.getState().setSidebarCollapsed(collapsed)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: sidebarCollapsed ? 16 : 18,
            fontWeight: 'bold',
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          {sidebarCollapsed ? 'AI' : 'AI网关管理'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout style={{ marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 200), transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorder}`,
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
            />
          ) : (
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
            />
          )}
          <Dropdown menu={{ items: userMenuItems, onClick: ({ key }) => key === 'logout' && handleLogout() }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
              <span>{user?.username || '管理员'}</span>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ margin: 16, padding: 24, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
