import _Object from './_Object';
import _EPub from './_EPub';

export default class _Handler extends _Object {
  static isInViewportWidth(/* x */) {
    return true;
  }

  static getLinkFromPoint(point) {
    const tolerance = 10;
    for (let x = point.x - tolerance; x <= point.x + tolerance; x++) {
      for (let y = point.y - tolerance; y <= point.y + tolerance; y++) {
        if (this.isInViewportWidth(x)) {
          const el = document.elementFromPoint(x, y);
          if (el) {
            const link = _EPub.getLinkFromElement(el);
            if (link !== null) {
              return link;
            }
          }
        }
      }
    }
    return null;
  }
}
