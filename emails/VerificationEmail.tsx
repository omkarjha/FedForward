"use client";
import React from 'react';

import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components';

interface VerificationEmailProps {
    userName: string;
    otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ userName, otp }) => {
    return (
        <Html>
            <Head>
                <Font fontFamily="Arial, sans-serif" fallbackFontFamily="sans-serif" />
            </Head>
            <Preview>Verify your email address</Preview>
            <Section style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', padding: '20px' }}>
                <Heading as="h2">Welcome to FeedForward, {userName}!</Heading>
                <Text>Thank you for signing up. Please verify your email address by using the OTP below:</Text>
                <Row>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0' }}>{otp}</Text>
                </Row>
                <Text>If you did not sign up for this account, please ignore this email.</Text>
                <Text>Best regards,</Text>
                <Text>The FeedForward Team</Text>
            </Section>
        </Html>
    );
};

export default VerificationEmail;
