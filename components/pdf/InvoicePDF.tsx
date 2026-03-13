import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QxlF_2A.ttf' }
    ]
});

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    logoText: { fontSize: 24, fontWeight: 'bold', color: '#F20000' },
    invoiceTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'right' },
    metaData: { textAlign: 'right', marginTop: 8 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, borderBottom: '1 solid #ccc', paddingBottom: 4 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 8, fontWeight: 'bold' },
    tableRow: { flexDirection: 'row', padding: 8, borderBottom: '1 solid #eee' },
    col1: { width: '40%' },
    col2: { width: '20%', textAlign: 'right' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },
    totalsArea: { marginTop: 20, width: '40%', alignSelf: 'flex-end' },
    footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#666', borderTop: '1 solid #ccc', paddingTop: 8 }
});

export type InvoiceDataProps = {
    invoiceNumber: string;
    invoiceDate: string;
    seller: {
        name: string;
        address: string;
        gstin?: string;
    };
    buyer: {
        name: string;
        email: string;
        gstin?: string;
    };
    item: {
        description: string;
        amountBeforeTax: number;
    };
    tax: {
        rate: number;
        cgst?: number;
        sgst?: number;
        igst?: number;
    };
    totalAmount: number;
    paymentDetails: {
        id: string;
        method: string;
        date: string;
    };
};

export const InvoicePDF = ({ data }: { data: InvoiceDataProps }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.logoText}>FITOSYS</Text>
                </View>
                <View style={styles.metaData}>
                    <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
                    <Text>Invoice no: {data.invoiceNumber}</Text>
                    <Text>Date: {data.invoiceDate}</Text>
                </View>
            </View>

            {/* Seller & Buyer Details */}
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <View style={{ width: '50%', paddingRight: 20 }}>
                    <Text style={styles.sectionTitle}>Billed By</Text>
                    <Text style={{ fontWeight: 'bold' }}>{data.seller.name}</Text>
                    <Text>{data.seller.address}</Text>
                    {data.seller.gstin && <Text>GSTIN: {data.seller.gstin}</Text>}
                </View>
                <View style={{ width: '50%', paddingLeft: 20 }}>
                    <Text style={styles.sectionTitle}>Billed To</Text>
                    <Text style={{ fontWeight: 'bold' }}>{data.buyer.name}</Text>
                    <Text>{data.buyer.email}</Text>
                    {data.buyer.gstin && <Text>GSTIN: {data.buyer.gstin}</Text>}
                </View>
            </View>

            {/* Line Items */}
            <View style={styles.tableHeader}>
                <Text style={styles.col1}>Description</Text>
                <Text style={styles.col2}>SAC</Text>
                <Text style={styles.col3}>Tax Rate</Text>
                <Text style={styles.col4}>Amount (INR)</Text>
            </View>
            <View style={styles.tableRow}>
                {/* SAC Code: 9983119 - Information Technology Consulting Services */}
                <Text style={styles.col1}>{data.item.description}</Text>
                <Text style={styles.col2}>9983119</Text>
                <Text style={styles.col3}>{data.tax.rate}%</Text>
                <Text style={styles.col4}>₹{data.item.amountBeforeTax.toFixed(2)}</Text>
            </View>

            {/* Totals */}
            <View style={styles.totalsArea}>
                <View style={styles.row}>
                    <Text>Subtotal:</Text>
                    <Text>₹{data.item.amountBeforeTax.toFixed(2)}</Text>
                </View>

                {data.tax.cgst ? (
                    <>
                        <View style={styles.row}>
                            <Text>CGST ({(data.tax.rate / 2)}%):</Text>
                            <Text>₹{data.tax.cgst.toFixed(2)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>SGST ({(data.tax.rate / 2)}%):</Text>
                            <Text>₹{data.tax.sgst?.toFixed(2) ?? '0.00'}</Text>
                        </View>
                    </>
                ) : data.tax.igst ? (
                    <View style={styles.row}>
                        <Text>IGST ({data.tax.rate}%):</Text>
                        <Text>₹{data.tax.igst.toFixed(2)}</Text>
                    </View>
                ) : null}

                <View style={[styles.row, { fontWeight: 'bold', borderTop: '1 solid #000', paddingTop: 8, marginTop: 4 }]}>
                    <Text>Total Amount:</Text>
                    <Text>₹{data.totalAmount.toFixed(2)}</Text>
                </View>
            </View>

            {/* Payment Information */}
            <View style={{ marginTop: 40, width: '50%' }}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <Text>Transaction ID: {data.paymentDetails.id}</Text>
                <Text>Payment Method: {data.paymentDetails.method}</Text>
                <Text>Paid On: {data.paymentDetails.date}</Text>
            </View>

            {/* Footer */}
            <Text style={styles.footer}>
                This is a computer-generated invoice and does not require a physical signature.{"\n"}
                Powered by Fitosys • support@fitosys.com
            </Text>

        </Page>
    </Document>
);
