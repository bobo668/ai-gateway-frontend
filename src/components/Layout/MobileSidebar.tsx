import { Drawer, Menu, Avatar, Dropdown, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  TeamOutlined,
  KeyOutlined,
  FileProtectOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

const { Text } = Typography

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表板' },
  { key: '/providers', icon: <TeamOutlined />, label: '服务商管理' },
  { key: '/consumers', icon: <UserOutlined />, label: '消费者管理' },
  { key: '/api-keys', icon: <KeyOutlined />, label: 'API Key管理' },
  { key: '/policies', icon: <FileProtectOutlined />, label: '访问策略' },
  { key: '/ratelimits', icon: <BarChartOutlined />, label: '限流配置' },
  { key: '/call-records', icon: <HistoryOutlined />, label: '调用记录' },
  { key: '/mcp', icon: <SettingOutlined />, label: 'MCP工具' },
  { key: '/reports', icon: <BarChartOutlined />, label: '成本报表' },
]

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
    onClose()
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
      navigate('/login')
    }
  }

  return (
    <Drawer
      title={
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
          <Text strong>{user?.username || 'Admin'}</Text>
        </Space>
      }
      placement="left"
      onClose={onClose}
      open={open}
      width={280}
      styles={{
        header: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0' },
        body: { padding: 0 },
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ border: 'none' }}
      />

      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', marginTop: 'auto' }}>
        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="topRight"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            <Avatar size="small" style={{ backgroundColor: '#722ed1' }} icon={<UserOutlined />} />
            <Text type="secondary">账户</Text>
          </div>
        </Dropdown>
      </div>
    </Drawer>
  )
}
