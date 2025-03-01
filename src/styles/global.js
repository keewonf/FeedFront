import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :focus {
    outline: transparent;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.COLORS.green_500};
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.COLORS.gray_900};
    color: ${({ theme }) => theme.COLORS.gray_300};
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button {
    font-family: "Roboto", serif;
    font-weight: 400;
    font-size: 1rem
  }
`