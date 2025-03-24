import { jsPDF } from 'jspdf';
import type { PaymentHistory } from '../types/payment';
import { COMPANY_INFO } from '../types/payment';
import { formatCurrency } from './currency';

export async function generateInvoice(payment: PaymentHistory): Promise<string> {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text('FACTURE', 105, 20, { align: 'center' });
  
  // Logo et informations de l'entreprise
  doc.setFontSize(16);
  doc.text('Kiota Suite', 20, 35);
  doc.setFontSize(10);
  doc.text('Le numérique au service de l\'inclusion financière des PMEs', 20, 42);
  
  // Informations de l'entreprise
  doc.setFontSize(10);
  doc.text('Propriétaire:', 20, 50);
  doc.text(COMPANY_INFO.name, 50, 50);
  
  doc.text([
    `${COMPANY_INFO.address.city}/${COMPANY_INFO.address.province}`,
    `${COMPANY_INFO.address.commune}, ${COMPANY_INFO.address.quartier}, ${COMPANY_INFO.address.street}`,
    `RCCM: ${COMPANY_INFO.registration.rccm}`,
    `ID NAT: ${COMPANY_INFO.registration.nationalId}`,
    `NIF: ${COMPANY_INFO.registration.taxNumber}`
  ], 20, 60);

  // Numéro et date de facture
  doc.text([
    `Facture N°: ${payment.invoiceNumber}`,
    `Date: ${payment.createdAt.toLocaleDateString()}`
  ], 140, 40);

  // Détails du paiement
  doc.setFontSize(12);
  doc.text('Détails du paiement', 20, 100);
  
  const details = [
    ['Description', payment.description],
    ['Montant (USD)', formatCurrency(payment.amount.usd, 'USD')],
    ['Montant (CDF)', formatCurrency(payment.amount.cdf, 'CDF')],
    ['Méthode', payment.method.name],
    ['Statut', payment.status === 'completed' ? 'Payé' : 'En attente']
  ];

  if (payment.tokenConsumption) {
    details.push(
      ['Tokens consommés', payment.tokenConsumption.count.toString()],
      ['Taux', `${payment.tokenConsumption.rate} USD/token`]
    );
  }

  let y = 110;
  details.forEach(([label, value]) => {
    doc.text(`${label}:`, 20, y);
    doc.text(value, 80, y);
    y += 10;
  });

  // Pied de page
  doc.setFontSize(10);
  doc.text([
    'Pour toute question concernant cette facture, veuillez nous contacter :',
    `Email: ${COMPANY_INFO.contact.email}`,
    `Tél: ${COMPANY_INFO.contact.phone}`
  ], 20, 250);

  return doc.output('datauristring');
}