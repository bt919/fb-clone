export default function SignIn() {
  return (
    <div className="flex flex-col items-center pt-20">
      <div className="bg-white border-2 border-gray-200 p-4 rounded-lg w-96 flex flex-col shadow-lg">
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address or phone number"
            className="p-3 border-2 border-gray-200"
          ></input>
          <input
            type="password"
            placeholder="password"
            className="p-3 border-2 border-gray-200"
          ></input>
          <button className="bg-blue-600 hover:bg-blue-500 text-gray-50 font-bold p-2 rounded-lg">
            Log in
          </button>
        </form>
        <div className="flex justify-center mb-3">
          <a
            aria-disabled
            className="text-blue-500 mt-4 hover:underline hover:underline-offset-2 hover:cursor-pointer"
          >
            Forgotten password?
          </a>
        </div>
        <div className="bg-slate-300 h-[1px] w-full m-2"></div>
        <div className="flex justify-center mt-2">
          <button className="bg-green-500 p-3 rounded-lg text-white font-bold w-48">
            Create new account
          </button>
        </div>
      </div>

      <p className="text-sm mt-6">
        <span className="font-bold hover:underline hover:cursor-pointer">
          Create a Page
        </span>{" "}
        for a celebrity, brand or business.
      </p>
    </div>
  );
}
