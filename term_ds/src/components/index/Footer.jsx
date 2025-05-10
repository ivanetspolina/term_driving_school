import { Mail } from "lucide-react";
import { Footer } from "flowbite-react";

export default function IndexFooter() {
  return (
    <Footer container>
      <div className="flex justify-center text-purple-950 items-center w-full b-0">
        <Mail size={20} className="inline-flex mr-2" />
        ivanetspolina@knu.ua
      </div>
    </Footer>
  );
}
