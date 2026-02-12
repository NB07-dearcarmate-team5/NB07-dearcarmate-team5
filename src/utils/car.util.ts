export const getCarTypeByModel = (model: string): '세단' | 'SUV' | '경차' => {
  const modelLower = model.toLowerCase();

  if (
    modelLower.includes('아반떼') || modelLower.includes('소나타') || modelLower.includes('그랜저') || 
    modelLower.includes('k3') || modelLower.includes('k5') || modelLower.includes('k7') || modelLower.includes('k8') || modelLower.includes('k9') || 
    modelLower.includes('g70') || modelLower.includes('g80') || modelLower.includes('g90') || 
    modelLower.includes('model 3') || modelLower.includes('model s')
  ) {
    return '세단';
  }
  if (
    modelLower.includes('투싼') || modelLower.includes('산타페') || modelLower.includes('싼타페') || modelLower.includes('팰리세이드') || modelLower.includes('코나') || 
    modelLower.includes('스포티지') || modelLower.includes('쏘렌토') || modelLower.includes('카니발') || modelLower.includes('셀토스') || 
    modelLower.includes('gv60') || modelLower.includes('gv70') || modelLower.includes('gv80') || 
    modelLower.includes('model y') || modelLower.includes('model x')
  ) {
    return 'SUV';
  }
  if (modelLower.includes('캐스퍼') || modelLower.includes('레이')) {
    return '경차';
  }
  
  return '세단';
};