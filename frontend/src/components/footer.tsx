export default function Footer() {
  const languages = [
    "English (UK)",
    "Français (Canada)",
    "Español",
    "中文(简体)",
    "한국어",
    "日本語",
    "Português (Brasil)",
    "Deutsch",
    "Italiano",
    "العربية",
    "हिन्दी",
  ];
  const keywords = [
    "Sign Up",
    "Log in",
    "Messenger",
    "Facebook Lite",
    "Video",
    "Places",
    "Games",
    "Marketplace",
    "Meta Pay",
    "Meta Store",
    "Meta Quest",
    "Ray-Ban Meta",
    "Meta AI",
    "Instagram",
    "Threads",
    "Fundraisers",
    "Services",
    "Voting Information Centre",
    "Privacy Policy",
    "Privacy Centre",
    "Groups",
    "About",
    "Create ad",
    "Create Page",
    "Developers",
    "Careers",
    "Cookies",
    "AdChoices",
    "Terms",
    "Help",
    "Contact uploading and non-users",
  ];

  return (
    <div className="text-xs opacity-60 flex flex-col items-center pt-4">
      <div className="flex gap-3 items-center">
        {languages.map((language) => (
          <p className="hover:underline hover:cursor-pointer" key={language}>
            {language}
          </p>
        ))}
        <button className="bg-gray-200 hover:bg-gray-300 border-gray-300 border-2 font-bold p-1 w-8">
          +
        </button>
      </div>

      <div className="bg-slate-300 h-[1px] w-[750px] m-2"></div>

      <div className="grid grid-rows-4 grid-flow-col gap-2 text-[10px]">
        {keywords.map((keyword) => (
          <p className="hover:underline hover:cursor-pointer" key={keyword}>
            {keyword}
          </p>
        ))}
      </div>
    </div>
  );
}
