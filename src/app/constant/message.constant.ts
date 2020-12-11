export const messageTitle = {
  SUCCESS: 'Thành Công',
  FAILED: 'Thất Bại',
  WARNING: 'Cảnh Báo',
  INFO: 'Thông Báo'
};

export const messageContent = {
  LOGIN_SUCCESS: 'Đăng nhập thành công !!!',
  LOGIN_FAILED:
    'Đăng nhập thất bại, vui lòng kiểm tra lại tài khoản hoặc mật khẩu!',
  LOG_OUT_SUCCESS: 'Đăng xuất thành công !!!',
  GET_USER_INFO_FAILED: 'Lấy thông tin đăng nhập thất bại, vui lòng đăng nhập lại',
  GET_FOOD_INFO_FAILED: 'Lấy thông tin món ăn thất bại',
  WELCOME_USER: 'Xin chào, ',
  WELCOME_DEFAULT: 'Quản lý nhà hàng',
  BOOK_TABLE_SUCCESS: 'Đặt bàn thành công! Đã có thể đặt món tại bàn này.',
  BOOK_TABLE_FAILED: 'Đặt bàn thất bại! Vui lòng thử lại sau.',
  BOOK_TABLE_ALREADY_TAKEN_FIRST_HALF: 'Bàn số ',
  BOOK_TABLE_ALREADY_TAKEN_LAST_HALF: ' hiện đã có người đặt trước, vui lòng chọn bàn khác.',
  GET_MENU_FAILED: 'Không tìm thấy thực đơn, vui lòng liên hệ người quản lý!',
  ORDER_FOOD_SUCCESS: 'Đặt món thành công! Vui lòng đợi trong giây lát.',
  ORDER_FOOD_FAILED: 'Đặt món thất bại! Vui lòng liên hệ người quản lý!',
  NEW_TABLE_ORDER_UPDATED: 'Vừa có thêm bàn đặt món. Các đầu bếp vui lòng cập nhật, xin cảm ơn.',
  NEW_ORDER_UPDATED: 'Món ăn vừa có sự thay đổi, đầu bếp vui lòng cập nhật, xin cảm ơn.',
  ASSIGN_CHIEF_SUCCESS: 'Đăng ký thành công! Bạn sẽ đảm nhiệm việc nấu ăn cho bàn này.',
  ASSIGN_CHIEF_FAILED: 'Đăng ký thất bại! Vui lòng thử lại hoặc liên hệ người quản lý!',
  GET_SELECTED_ORDER_FAILED: 'Lấy thông tin món ăn của bàn này thất bại, vui lòng thử lại hoặc liên hệ người quản lý!',
  UPDATE_QUANTITY_SUCCESS: 'Cập nhật quá trình nấu thành công!',
  UPDATE_QUANTITY_FAILED: 'Cập nhật quá trình nấu thất bại, vui lòng thử lại hoặc liên hệ người quản lý.',
  START_COOKING_FAILED: 'Bắt đầu nấu thất bại, vui lòng thử lại hoặc liên hệ người quản lý.',
  USER_ALREADY_TAKEN: 'Tài khoản này đã được sử dụng, vui lòng chọn tài khoản khác.',
  ID_ALREADY_TAKEN: 'ID đã được sử dụng, vui lòng chọn ID khác.',
  USER_ADDED_FAILED: 'Thêm tài khoản thất bại, vui lòng thử lại.',
  USER_ADDED_SUCCESS: 'Thêm tài khoản thành công.',
  USER_DELETE_FAILED: 'Xóa tài khoản thất bại, vui lòng thử lại',
  USER_DELETE_SUCCESS: 'Xóa tài khoản thành công.',
  FOOD_ADDED_FAILED: 'Thêm món ăn thất bại, vui lòng thử lại.',
  FOOD_ADDED_SUCCESS: 'Thêm món ăn thành công.',
  FOOD_DELETE_FAILED: 'Xóa món ăn thất bại, vui lòng thử lại',
  FOOD_DELETE_SUCCESS: 'Xóa món ăn thành công.',
  UPDATED_FAILED: 'Sửa đổi thông tin thất bại, vui lòng thử lại.',
  UPDATED_SUCCESS: 'Sửa đổi thông tin thành công.',
  GET_PENDING_ORDERS_FAILED: 'Không tìm được thông tin các bàn, vui lòng thử lại sau.',
  PAID_FAILED: 'Thanh toán thất bại, vui lòng thử lại.',
  PAID_SUCCESS: 'Thanh toán thành công!'
};

export const dialogMessage = {
  LOG_OUT_MESSAGE: 'Bạn thật sự muốn đăng xuất?',
  BOOK_TABLE_CONFIRM_FIRST_HALF: 'Bàn số ',
  BOOK_TABLE_CONFIRM_LAST_HALF: ' đang trống, xác nhận đặt bàn này?',
  ORDER_TAKE_CONFIRM: 'Xác nhận đảm nhiệm đứng bếp cho bàn này?',
  ORDER_TAKE_OVER_CONFIRM_FIRST_HALF: 'Bàn này đã được đảm nhiệm bởi đầu bếp ',
  ORDER_TAKE_OVER_CONFIRM_LAST_HALF: ', bạn muốn đảm nhiệm đứng bếp thay?',
  DELETE_USER_CONFIRM: 'Bạn chắc chắn muốn xóa người dùng',
  DELETE_FOOD_CONFIRM: 'Bạn chắc chắn muốn xóa món ăn',
  PAID_CONFIRM: 'Khách hàng đã thanh toán?'
};

export const dialogTitle = {
  LOG_OUT_TITLE: 'Đăng xuất',
  BOOK_TABLE_CONFIRM_FIRST_HALF: 'Đặt bàn số ',
  BOOK_TABLE_CONFIRM_LAST_HALF: '?',
  ORDER_FOOD_CONFIRM: 'Xác nhận đặt món?',
  VIEW_FOOD_ORDER: 'Thông tin món của bàn số ',
  ORDER_TAKE_CONFIRM_FIRST_HALF: 'Xác nhận chọn bàn số ',
  ORDER_TAKE_CONFIRM_LAST_HALF: '?',
  DELETE_USER_CONFIRM: 'Xác nhận xóa tài khoản này?',
  DELETE_FOOD_CONFIRM: 'Xác nhận xóa món ăn này?',
  PAID_CONFIRM: 'Xác nhận thanh toán?'
};

export const spinnerContent = {
  WAITING_CONTENT: 'Vui lòng đợi',
  NAVIGATE_CONTENT_FIRST_HALF: 'Bạn sẽ được chuyển hướng trong vòng',
  NAVIGATE_CONTENT_LAST_HALF: 'giây nữa.',
}

export const voiceContent = {
  CUSTOMER_THANKS: 'Xin cảm ơn quý khách!'
}
