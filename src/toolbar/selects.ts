export function makeSelect(
  doc: Document,
  options: { onCommand: (command: string, value?: string) => void },
  title: string,
  command: string,
  optionsList: { label: string; value: string }[],
  initialValue?: string | null
) {
  const select = doc.createElement("select");
  select.title = title;
  select.setAttribute("aria-label", title);
  select.appendChild(new Option(title, "", true, true));
  for (const opt of optionsList) {
    select.appendChild(new Option(opt.label, opt.value));
  }
  try {
    if (initialValue) select.value = initialValue;
  } catch (e) {
    /* ignore invalid value */
  }
  select.onchange = (e: Event) => {
    const val = (e.target as HTMLSelectElement).value;
    options.onCommand(command, val);
    select.selectedIndex = 0;
  };
  return select;
}
