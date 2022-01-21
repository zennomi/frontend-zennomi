// components
import SvgIconStyle from '../../../components/SvgIconStyle';
// paths
import { PATH_LEARNING, PATH_WIBU } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Zennomi',
    items: [
      {
        title: PATH_WIBU.label,
        path: PATH_WIBU.root,
        icon: <Iconify icon='ant-design:trophy-twotone' />,
        children: [
          { title: PATH_WIBU.title.label, path: PATH_WIBU.title.root },
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
