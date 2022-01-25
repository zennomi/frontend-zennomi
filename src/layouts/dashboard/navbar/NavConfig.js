// components
import SvgIconStyle from '../../../components/SvgIconStyle';
// paths
import { PATH_LEARNING, PATH_WIBU } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Zennomi',
    items: [
      {
        title: 'Trang chủ',
        path: '/homepage',
        icon: <Iconify icon='ant-design:home-twotone' />,
      },
      {
        title: 'Profile',
        path: '/profile',
        icon: <Iconify icon='ant-design:profile-twotone' />,
      },
      {
        title: PATH_WIBU.label,
        path: PATH_WIBU.root,
        icon: <Iconify icon='ant-design:trophy-twotone' />,
        children: [
          { title: PATH_WIBU.title.label, path: PATH_WIBU.title.root },
          { title: 'Thuốc mới', path: PATH_WIBU.title.feed },
          { title: 'Thêm hàng mới', path: PATH_WIBU.title.new }
        ]
      },
      
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: '/dashboard/user',
        icon: <Iconify icon='carbon:user-avatar-filled-alt' />,
        children: [
          { title: 'Four', path: '/dashboard/user/four' },
          { title: 'Five', path: '/dashboard/user/five' },
          { title: 'Six', path: '/dashboard/user/six' },
        ],
      },
    ],
  },
];

export default sidebarConfig;
