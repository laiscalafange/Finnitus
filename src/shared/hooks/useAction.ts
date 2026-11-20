/**
 * Compatibilidade com telas que continuam usando o hook useAction.
 * Reutiliza a mesma implementação do useAuthAction.
 *
 * Importações existentes continuam funcionando:
 * import { useAction } from '../../shared/hooks/useAction';
 */
export { useAuthAction as useAction } from "./useAuthAction";
