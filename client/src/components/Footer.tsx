const Footer = () => {
  return (
    <footer className="mt-12  bg-teal-400 py-6">
      <div className=" mx-auto px-12 flex flex-col md:flex-row justify-between items-center text-sm text-white gap-4">
        <p>&copy; {new Date().getFullYear()} SURAA. All rights reserved.</p>
        <div className="flex gap-4">
          <button
            onClick={() => console.log("TODO: Terms")}
            className="hover:text-gray-900 transition "
          >
            Terms
          </button>
          <button
            onClick={() => console.log("TODO: Privacy")}
            className="hover:text-gray-900 transition"
          >
            Privacy
          </button>
          <button
            onClick={() => console.log("TODO: Contact")}
            className="hover:text-gray-900 transition"
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
