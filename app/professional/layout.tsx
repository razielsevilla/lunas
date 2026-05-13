import ProfessionalLayout from '@/components/layout/ProfessionalLayout';

export default function ProfessionalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProfessionalLayout>{children}</ProfessionalLayout>;
}
