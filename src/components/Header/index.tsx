import ClientOnly from "../CilentOnly";
import WalletButtons from "../WalletButtons";

const header = () => {
  return (
    <header className="md:sticky top-0 z-10 flex justify-between items-center md:px-6 py-4 bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 shadow-md w-full gap-2">
      <h1 className="text-2xl hidden sm:block">Aptogotchi</h1>
      <ClientOnly>
        <WalletButtons />
      </ClientOnly>
    </header>
  );
};

export default header;
