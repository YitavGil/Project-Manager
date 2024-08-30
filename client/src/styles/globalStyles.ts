import { css } from '@emotion/react';

const globalStyles = css`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(45deg, #f3e5f5, #e8eaf6);
    min-height: 100vh;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .gradient-text {
    background: linear-gradient(45deg, #3f51b5, #f50057);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .card-hover {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }
  }
`;

export default globalStyles;