function Footer() {
  return (
    <footer className="bg-gray-100 p-4 text-center border-t mt-10 text-sm text-gray-600">
      © {new Date().getFullYear()} - APPLICATION MARKDOWN
      <div className="mt-4">
        <small className="text-gray-500 text-center">Développé par :</small>
        <div className="flex gap-2 justify-center mt-2">
          <small className="bg-gray-200 px-2 py-1 rounded-md">
            Aboubakr ZENNIR
          </small>
          <small className="bg-gray-200 px-2 py-1 rounded-md">Enzo K.</small>
          <small className="bg-gray-200 px-2 py-1 rounded-md">
            Marevan CONTI
          </small>
          <small className="bg-gray-200 px-2 py-1 rounded-md">Dorian</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
