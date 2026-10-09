import { ScrollView, Text, View } from 'react-native';
import { styles } from './Terms.styles';

export function TermsScreen() {
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
    <Text style={styles.eyebrow}>GARAGEAPP</Text>
    <Text style={styles.title}>Bases y condiciones</Text>
    <View style={styles.card}>
      <Text style={styles.heading}>Uso de la plataforma</Text>
      <Text style={styles.text}>GarageApp conecta a conductores con propietarios de espacios de estacionamiento. Al usar la aplicación, aceptás brindar información verdadera y utilizar los espacios reservados únicamente durante el horario confirmado.</Text>
      <Text style={styles.heading}>Reservas y pagos</Text>
      <Text style={styles.text}>Una reserva queda confirmada luego de que el pago sea aprobado. Los créditos y pagos con tarjeta se procesan según el método elegido. La reserva se inicia cuando el cliente y el propietario confirman su inicio en la aplicación.</Text>
      <Text style={styles.heading}>Responsabilidad</Text>
      <Text style={styles.text}>Cada usuario es responsable de cumplir las normas del estacionamiento, respetar horarios y mantener una conducta adecuada. El propietario debe mantener la información y disponibilidad de su espacio actualizadas.</Text>
      <Text style={styles.heading}>Privacidad</Text>
      <Text style={styles.text}>Usamos tus datos para gestionar tu cuenta, reservas, pagos y comunicaciones necesarias del servicio. No compartimos información personal salvo cuando sea necesario para prestar el servicio o cumplir obligaciones legales.</Text>
      <Text style={styles.updated}>Última actualización: octubre de 2026.</Text>
    </View>
  </ScrollView>;
}
