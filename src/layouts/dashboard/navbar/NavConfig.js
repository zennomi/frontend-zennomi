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
        title: 'About',
        path: '/profile',
        icon: <Iconify icon='ant-design:question-circle-twotone' />,
      },
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
        // children: [
        //   { title: 'Top romcom', path: PATH_WIBU.title.root },
        //   { title: 'Thuốc mới', path: PATH_WIBU.title.feed },
        //   { title: 'Thêm hàng mới', path: PATH_WIBU.title.new }
        // ]
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
      },
    ],
  },
];

export default sidebarConfig;
