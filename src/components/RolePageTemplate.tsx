interface RolePageTemplateProps {
  darkMode?: boolean;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  checklist: string[];
  highlights: string[];
}

const RolePageTemplate = ({
  darkMode = false,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  checklist,
  highlights,
}: RolePageTemplateProps) => {
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row dark:text-white justify-between items-center dark:bg-black font-sans gap-4 md:gap-0">
        <div className="w-full md:w-[34%] flex flex-col items-center justify-center text-center p-2 md:p-6 m-2 md:m-4">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-24 w-24 md:h-32 md:w-32 object-contain mb-3 md:mb-4"
            loading="lazy"
          />
          <div className="text-xl text-[#0B3C5D] dark:text-white md:text-2xl font-bold">{title}</div>
          <div className="p-2 m-2 text-sm text-[#8e8e93] md:text-base">{subtitle}</div>
        </div>

        <div className="w-full max-w-4xl m-2 md:m-4 px-3 md:px-4 md:px-8 py-6 md:py-8 relative z-10">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Workflow Checklist</h2>
                <ul className="mt-3 space-y-2">
                  {checklist.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-[#0B3C5D] p-2 text-sm text-black dark:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">AI + Insights</h2>
                <ul className="mt-3 space-y-2">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-[#0B3C5D] p-2 text-sm text-black dark:text-white"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePageTemplate;
