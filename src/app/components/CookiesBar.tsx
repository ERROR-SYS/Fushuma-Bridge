import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const COOKIES_KEY = 'cookies-consented';

const CookiesBar = () => {
  const [cookiesApproved, setCookiesApproved] = useState(() => localStorage.getItem(COOKIES_KEY) === '1');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setFadeIn(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  const onAccept = () => {
    localStorage.setItem(COOKIES_KEY, '1');
    setFadeIn(false);
    setTimeout(() => setCookiesApproved(true), 1000);
  };

  if (cookiesApproved) return null;

  return (
    <Container show={fadeIn}>
      <Subcontainer>
        <Text>
          We use cookies to enhance your experience on our website. By continuing to browse our site, you consent to our
          use of cookies. To find out more about how we use cookies, please see our&nbsp;
          <Link href="/docs/cookies-policy.pdf" target="_blank" rel="noopener noreferrer">
            Cookies Policy
          </Link>
          .
        </Text>
        <Button type="button" onClick={onAccept}>
          Accept
        </Button>
      </Subcontainer>
    </Container>
  );
};

const Container = styled.div<{ show: boolean }>`
  position: fixed;
  z-index: 100;
  width: 100%;

  transition: all 0.7s;
  bottom: ${({ show }) => (!show ? 0 : 15)}px;
  opacity: ${({ show }) => (!show ? 0 : 1)};
`;

const Subcontainer = styled.div`
  width: 100%;
  max-width: 800px;
  background-color: #000000;
  padding: 16px;
  margin: 0px auto;
  border-radius: 14px;
`;

const Text = styled.p`
  font-family: 'NotoSans';
  font-size: 16px;
  color: white;
  line-height: 1.2;
`;

const Link = styled.a`
  color: white;
  font-family: 'NotoSans';
  font-weight: 700;
  text-decoration: none !important;
  transition: all 0.3s;
  &:hover {
    color: #ce1f2e;
    transition: all 0.3s;
  }
`;

const Button = styled.button`
  margin-top: 15px;
  color: #000000;
  background-color: white;
  font-size: 18px;
  font-family: 'NotoSans';
  height: 40px;
  width: 160px;
  padding: 5px 40px;
  border: 0;
  border-radius: 52px;
  transition: all 0.3s;

  &:hover {
    transition: all 0.3s;
    font-weight: 700;
  }
`;

export default CookiesBar;
