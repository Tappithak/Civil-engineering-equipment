declare global {
  interface Window {
    Highcharts: {
      mapChart: (renderTo: string | HTMLElement, options: any) => any;
    };
  }
}
export {};