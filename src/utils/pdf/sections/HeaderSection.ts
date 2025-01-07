export const generateHeaderSection = (doc: HTMLDivElement) => {
  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px; background: #F1F0FB; border-radius: 8px; margin-bottom: 32px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img 
          src="/lovable-uploads/23135d22-4ba2-4f66-a179-9bd803c29569.png" 
          alt="ChatSites Logo" 
          style="height: 40px; width: auto;"
        />
        <div>
          <span style="font-size: 24px; font-weight: bold; color: #9b87f5;">ChatSites Analysis Report</span>
          <div style="margin-top: 4px;">
            <p style="margin: 0; font-size: 14px; color: #666;">www.chatsites.ai</p>
            <p style="margin: 2px 0 0; font-size: 14px; color: #666;">Contact: support@chatsites.ai</p>
          </div>
        </div>
      </div>
    </div>
  `;
  doc.appendChild(header);
};