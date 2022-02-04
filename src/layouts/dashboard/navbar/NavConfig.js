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
        title: 'Điều nên biết',
        path: '/profile',
        icon: <Iconify icon='ant-design:question-circle-twotone' />,
      },
      {
        title: 'Donate',
        path: '/donate',
        icon: <Iconify icon='ant-design:gift-twotone' />,
      },
    ],
  },
  {
    subheader: 'Wibu',
    items: [
      {
        title: PATH_WIBU.title.label,
        path: PATH_WIBU.title.root,
        icon: <Iconify icon='ant-design:book-twotone' />,
        children: [
          { title: 'Top romcom', path: PATH_WIBU.title.root },
          { title: 'Thuốc mới', path: PATH_WIBU.title.feed },
          { title: 'Thêm hàng mới', path: PATH_WIBU.title.new, icon: <Iconify icon='ant-design:plus-circle-twotone' /> }
        ]
      },
      {
        title: PATH_WIBU.list.label,
        path: PATH_WIBU.list.root,
        icon: <Iconify icon='ant-design:profile-twotone' />,
        children: [
          { title: 'Danh sách', path: PATH_WIBU.list.root },
          { title: 'Tạo bộ sưu tập', path: PATH_WIBU.list.new },
        ]
      },
      {
        title: 'Thống kê',
        path: '/statistics',
        icon: <Iconify icon='ant-design:pie-chart-twotone' />,
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'management',
  //   items: [
  //     {
  //       title: 'user',
  //       path: '/dashboard/user',
  //       icon: <Iconify icon='carbon:user-avatar-filled-alt' />,
  //     },
  //   ],
  // },
];

export default sidebarConfig;
