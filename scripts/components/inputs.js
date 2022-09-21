export function input({
  label,
  id,
  name,
  placeholder = "",
  type,
  required = false,
  value = false,
  focus = false,
  error = "",
  icon = "",
}) {
  return `
  <div class="input">
    ${
      label
        ? `<label for="${id}" class="content-xs overline">${label}</label>`
        : ""
    }
    <div class="input__container">
      ${
        icon
          ? `<img
          src="${icon}"
          alt=""
          class="input__icon"
        />`
          : ""
      }
      <input
        type="${type ? type : "text"}"
        placeholder="${placeholder}"
        class="input__content ${error ? "input-error" : ""}"
        id="${id}"
        name="${name ? name : id}"
        ${value ? `value="${value}"` : ""}
        ${required ? "required" : ""}
      />
      ${error ? `<p class = "error-300"> ${error} </p>` : ""}
      
    </div>
  </div>
  `;
}
