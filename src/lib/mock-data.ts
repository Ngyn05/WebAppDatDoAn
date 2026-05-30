import { MenuItem } from '@/types'

export const CATEGORIES = [
  { id: 'com', name: 'Cơm', emoji: '🍚' },
  { id: 'pho', name: 'Phở & Bún', emoji: '🍜' },
  { id: 'banh', name: 'Bánh', emoji: '🥖' },
  { id: 'douong', name: 'Đồ uống', emoji: '🧋' },
  { id: 'all', name: 'Tất cả', emoji: '🍽️' },
]

export const MOCK_MENU: MenuItem[] = [
  {
    id: '1',
    name: 'Cơm Tấm Sườn Bì Chả',
    description: 'Cơm tấm đặc biệt với sườn nướng than hoa, bì và chả trứng. Ăn kèm đồ chua, nước mắm pha.',
    price: 55000,
    image_url: '',
    category: 'com',
    is_available: true,
  },
  {
    id: '2',
    name: 'Phở Bò Tái Nạm',
    description: 'Phở bò truyền thống với nước dùng ninh xương 12 tiếng, thịt bò tái và nạm mềm.',
    price: 50000,
    image_url: '',
    category: 'pho',
    is_available: true,
  },
  {
    id: '3',
    name: 'Bún Bò Huế',
    description: 'Bún bò đặc sản Huế với nước lèo cay nồng sả ớt, giò heo, huyết và chả cua.',
    price: 55000,
    image_url: '',
    category: 'pho',
    is_available: true,
  },
  {
    id: '4',
    name: 'Bánh Mì Thịt Nướng',
    description: 'Bánh mì giòn rụm kẹp thịt nướng, đồ chua, rau thơm và nước sốt đặc biệt.',
    price: 30000,
    image_url: '',
    category: 'banh',
    is_available: true,
  },
  {
    id: '5',
    name: 'Cơm Gà Xối Mỡ',
    description: 'Cơm gà với đùi gà chiên giòn xối mỡ, ăn kèm canh và rau sống.',
    price: 50000,
    image_url: '',
    category: 'com',
    is_available: true,
  },
  {
    id: '6',
    name: 'Bún Chả Hà Nội',
    description: 'Bún chả phong cách Hà Nội với chả viên nướng, thịt ba chỉ và nước mắm chua ngọt.',
    price: 45000,
    image_url: '',
    category: 'pho',
    is_available: true,
  },
  {
    id: '7',
    name: 'Gỏi Cuốn Tôm Thịt',
    description: 'Gỏi cuốn tươi mát với tôm, thịt heo luộc, bún và rau sống. Chấm tương đậu phộng.',
    price: 35000,
    image_url: '',
    category: 'banh',
    is_available: true,
  },
  {
    id: '8',
    name: 'Trà Sữa Trân Châu',
    description: 'Trà sữa đậm đà với trân châu đường đen dẻo mềm, thêm kem cheese béo ngậy.',
    price: 35000,
    image_url: '',
    category: 'douong',
    is_available: true,
  },
  {
    id: '9',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê phin truyền thống Việt Nam pha với sữa đặc, đá viên mát lạnh.',
    price: 25000,
    image_url: '',
    category: 'douong',
    is_available: true,
  },
  {
    id: '10',
    name: 'Nước Ép Cam Tươi',
    description: 'Nước ép cam tươi 100% nguyên chất, không đường, giàu vitamin C.',
    price: 30000,
    image_url: '',
    category: 'douong',
    is_available: true,
  },
]

export const FOOD_GRADIENTS: Record<string, string> = {
  com: 'linear-gradient(135deg, #FF6B35 0%, #F7C948 100%)',
  pho: 'linear-gradient(135deg, #E44D26 0%, #FF8C42 100%)',
  banh: 'linear-gradient(135deg, #D4A574 0%, #E8C07A 100%)',
  douong: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
}

export const FOOD_EMOJIS: Record<string, string> = {
  '1': '🍚',
  '2': '🍜',
  '3': '🍜',
  '4': '🥖',
  '5': '🍗',
  '6': '🥢',
  '7': '🥗',
  '8': '🧋',
  '9': '☕',
  '10': '🍊',
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}
