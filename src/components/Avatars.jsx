import React from 'react';

export const Ghost = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2C9.8 2 8 3.8 8 6v1H6c-1.1 0-2 .9-2 2v7.5C4 18.9 5.1 20 6.5 20H7c.5 0 .9-.2 1.2-.5.3-.3.7-.5 1.3-.5s1 .2 1.3.5c.3.3.7.5 1.2.5s.9-.2 1.2-.5c.3-.3.7-.5 1.3-.5s1 .2 1.3.5c.3.3.7.5 1.2.5h.5c1.4 0 2.5-1.1 2.5-2.5V9c0-1.1-.9-2-2-2h-2V6c0-2.2-1.8-4-4-4z" fill="currentColor"/>
    <circle cx="9" cy="10" r="1.1" fill="#0b1220"/>
    <circle cx="15" cy="10" r="1.1" fill="#0b1220"/>
  </svg>
);

export const Skull = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2c3.9 0 7 3.1 7 7v2a4 4 0 0 1-3 3.9V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.1A4 4 0 0 1 5 11V9c0-3.9 3.1-7 7-7z" fill="currentColor"/>
    <circle cx="9" cy="11" r="1.1" fill="#0b1220"/>
    <circle cx="15" cy="11" r="1.1" fill="#0b1220"/>
    <path d="M8.5 16c.8.8 1.9 1 3.5 1s2.7-.2 3.5-1" stroke="#0b1220" strokeWidth="0.7" strokeLinecap="round"/>
  </svg>
);

export const Bat = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M2 12s3-3 6-3 4 2 4 2 1-2 4-2 6 3 6 3-2 7-8 7c-4 0-4-2-4-2s0 2-3 2C4 19 2 12 2 12z" fill="currentColor"/>
  </svg>
);

export const Moon = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" fill="currentColor"/>
  </svg>
);

export const AVATARS = { Ghost, Skull, Bat, Moon };
