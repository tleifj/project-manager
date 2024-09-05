export default function SidebarAccount() {
  return (
    <div className="sidebar-account flex justify-between items-center">
      <div className="account-info flex justify-between items-center gap-4">
        <div className="avatar w-[24px] h-[24px] bg-gray-500 rounded-full ">
          {/* <img src="/avatar.jpg" alt="" /> */}
        </div>
        <div className="user-info">
          <p className="text-xs mb-0">Visceral</p>
        </div>
      </div>
      <div className="account-action">
        <button>+</button>
      </div>
    </div>
  );
}
