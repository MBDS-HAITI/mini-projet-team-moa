import React from 'react';
import ContactForm from '../ContactForm';

export default function Contact() {
  return (
    <div style={{ maxWidth: 600, margin: '2.5rem auto', padding: '32px 0' }}>
      <h2 style={{ textAlign: 'center' }}>Contact us</h2>
      <p>For any questions or suggestions, use the form below:</p>
      <ContactForm />
    </div>
  );
}
