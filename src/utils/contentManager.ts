// Content Management System for dynamic content updates
import React from 'react';

export interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'service' | 'testimonial' | 'announcement';
  title: string;
  content: ServiceContent | TestimonialContent | AnnouncementContent | Record<string, unknown>;
  language: string;
  lastModified: number;
  isActive: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface ServiceContent {
  name: string;
  description: string;
  pricing: Record<string, string>;
  duration: string[];
  image?: string;
  features?: string[];
}

export interface AnnouncementContent {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'promotion';
  startDate: number;
  endDate: number;
  priority: number;
}

export interface TestimonialContent {
  name: string;
  message: string;
  rating: number;
  date: number;
  verified: boolean;
}

class ContentManager {
  private content: Map<string, ContentItem> = new Map();
  private subscribers: Set<(content: ContentItem[]) => void> = new Set();
  private storageKey = 'thai-massage-content';

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultContent();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const contentArray = JSON.parse(stored) as ContentItem[];
        contentArray.forEach(item => {
          this.content.set(item.id, item);
        });
      }
    } catch (error) {
      console.warn('Failed to load content from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      const contentArray = Array.from(this.content.values());
      localStorage.setItem(this.storageKey, JSON.stringify(contentArray));
    } catch (error) {
      console.warn('Failed to save content to storage:', error);
    }
  }

  private initializeDefaultContent() {
    // Only add default content if storage is empty
    if (this.content.size === 0) {
      this.addDefaultServices();
      this.addDefaultTestimonials();
      this.addDefaultAnnouncements();
    }
  }

  private addDefaultServices() {
    const services: ServiceContent[] = [
      {
        name: 'Traditional Thai Massage',
        description: 'Often called "two-person yoga," this traditional Thai stretching realigns the body and mind.',
        pricing: {
          '60min': '¥4,500',
          '90min': '¥6,500',
          '120min': '¥8,500'
        },
        duration: ['60min', '90min', '120min'],
        features: ['Full body stretching', 'Pressure point therapy', 'Energy line work']
      },
      {
        name: 'Aroma Oil Massage',
        description: 'A gentle treatment using natural aromatic oils to care for the entire body.',
        pricing: {
          '60min': '¥4,500',
          '90min': '¥6,500',
          '120min': '¥8,500'
        },
        duration: ['60min', '90min', '120min'],
        features: ['Natural essential oils', 'Deep relaxation', 'Skin nourishment']
      },
      {
        name: 'Foot Reflexology',
        description: 'Stimulate foot reflex zones to promote overall well-being and relaxation.',
        pricing: {
          '30min': '¥2,500',
          '60min': '¥4,500'
        },
        duration: ['30min', '60min'],
        features: ['Pressure point stimulation', 'Improved circulation', 'Stress relief']
      }
    ];

    services.forEach((service, index) => {
      this.addContent({
        id: `service-${index + 1}`,
        type: 'service',
        title: service.name,
        content: service,
        language: 'en',
        lastModified: Date.now(),
        isActive: true
      });
    });
  }

  private addDefaultTestimonials() {
    const testimonials: TestimonialContent[] = [
      {
        name: 'Tanaka-san',
        message: 'The traditional Thai massage was amazing! I felt completely relaxed and rejuvenated.',
        rating: 5,
        date: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        verified: true
      },
      {
        name: 'Sarah M.',
        message: 'Professional service and authentic techniques. Highly recommended!',
        rating: 5,
        date: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
        verified: true
      },
      {
        name: 'Yamamoto-san',
        message: 'The aroma oil massage was perfect for stress relief. Will definitely come back.',
        rating: 5,
        date: Date.now() - 21 * 24 * 60 * 60 * 1000, // 21 days ago
        verified: true
      }
    ];

    testimonials.forEach((testimonial, index) => {
      this.addContent({
        id: `testimonial-${index + 1}`,
        type: 'testimonial',
        title: `Testimonial from ${testimonial.name}`,
        content: testimonial,
        language: 'en',
        lastModified: Date.now(),
        isActive: true
      });
    });
  }

  private addDefaultAnnouncements() {
    const announcements: AnnouncementContent[] = [
      {
        title: 'New Year Special Offer',
        message: 'Get 20% off on all 90-minute sessions during January!',
        type: 'promotion',
        startDate: Date.now(),
        endDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        priority: 1
      }
    ];

    announcements.forEach((announcement, index) => {
      this.addContent({
        id: `announcement-${index + 1}`,
        type: 'announcement',
        title: announcement.title,
        content: announcement,
        language: 'en',
        lastModified: Date.now(),
        isActive: true
      });
    });
  }

  public addContent(item: ContentItem): void {
    this.content.set(item.id, item);
    this.saveToStorage();
    this.notifySubscribers();
  }

  public updateContent(id: string, updates: Partial<ContentItem>): boolean {
    const existing = this.content.get(id);
    if (!existing) return false;

    const updated = {
      ...existing,
      ...updates,
      lastModified: Date.now()
    };

    this.content.set(id, updated);
    this.saveToStorage();
    this.notifySubscribers();
    return true;
  }

  public deleteContent(id: string): boolean {
    const deleted = this.content.delete(id);
    if (deleted) {
      this.saveToStorage();
      this.notifySubscribers();
    }
    return deleted;
  }

  public getContent(id: string): ContentItem | undefined {
    return this.content.get(id);
  }

  public getContentByType(type: ContentItem['type'], language?: string): ContentItem[] {
    return Array.from(this.content.values())
      .filter(item => 
        item.type === type && 
        item.isActive &&
        (!language || item.language === language)
      )
      .sort((a, b) => b.lastModified - a.lastModified);
  }

  public getAllContent(): ContentItem[] {
    return Array.from(this.content.values());
  }

  public getActiveAnnouncements(): ContentItem[] {
    const now = Date.now();
    return this.getContentByType('announcement')
      .filter(item => {
        const announcement = item.content as AnnouncementContent;
        return announcement.startDate <= now && announcement.endDate >= now;
      })
      .sort((a, b) => {
        const aContent = a.content as AnnouncementContent;
        const bContent = b.content as AnnouncementContent;
        return bContent.priority - aContent.priority;
      });
  }

  public getServices(language?: string): ServiceContent[] {
    return this.getContentByType('service', language)
      .map(item => item.content as ServiceContent);
  }

  public getTestimonials(language?: string, limit?: number): TestimonialContent[] {
    const testimonials = this.getContentByType('testimonial', language)
      .map(item => item.content as TestimonialContent)
      .sort((a, b) => b.date - a.date);

    return limit ? testimonials.slice(0, limit) : testimonials;
  }

  public subscribe(callback: (content: ContentItem[]) => void): () => void {
    this.subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers(): void {
    const allContent = this.getAllContent();
    this.subscribers.forEach(callback => {
      try {
        callback(allContent);
      } catch (error) {
        console.warn('Error in content subscriber:', error);
      }
    });
  }

  public exportContent(): string {
    return JSON.stringify(Array.from(this.content.values()), null, 2);
  }

  public importContent(jsonContent: string): boolean {
    try {
      const contentArray = JSON.parse(jsonContent) as ContentItem[];
      
      // Validate content structure
      if (!Array.isArray(contentArray)) {
        throw new Error('Invalid content format');
      }

      // Clear existing content
      this.content.clear();

      // Add imported content
      contentArray.forEach(item => {
        if (this.validateContentItem(item)) {
          this.content.set(item.id, item);
        }
      });

      this.saveToStorage();
      this.notifySubscribers();
      return true;
    } catch (error) {
      console.error('Failed to import content:', error);
      return false;
    }
  }

  private validateContentItem(item: unknown): item is ContentItem {
    return (
      typeof item === 'object' &&
      item !== null && // Add null check
      typeof (item as ContentItem).id === 'string' &&
      typeof (item as ContentItem).type === 'string' &&
      typeof (item as ContentItem).title === 'string' &&
      typeof (item as ContentItem).language === 'string' &&
      typeof (item as ContentItem).lastModified === 'number' &&
      typeof (item as ContentItem).isActive === 'boolean' &&
      (item as ContentItem).content !== undefined
    );
  }

  public searchContent(query: string, type?: ContentItem['type']): ContentItem[] {
    const searchTerm = query.toLowerCase();
    
    return Array.from(this.content.values())
      .filter(item => {
        if (type && item.type !== type) return false;
        if (!item.isActive) return false;

        const titleMatch = item.title.toLowerCase().includes(searchTerm);
        const contentMatch = JSON.stringify(item.content).toLowerCase().includes(searchTerm);
        
        return titleMatch || contentMatch;
      })
      .sort((a, b) => b.lastModified - a.lastModified);
  }

  public getContentStats(): {
    total: number;
    byType: Record<string, number>;
    active: number;
    inactive: number;
  } {
    const allContent = Array.from(this.content.values());
    
    const byType: Record<string, number> = {};
    let active = 0;
    let inactive = 0;

    allContent.forEach(item => {
      byType[item.type] = (byType[item.type] || 0) + 1;
      if (item.isActive) {
        active++;
      } else {
        inactive++;
      }
    });

    return {
      total: allContent.length,
      byType,
      active,
      inactive
    };
  }
}

// Singleton instance
export const contentManager = new ContentManager();

// Convenience hooks for React components
export const useContent = (type?: ContentItem['type'], language?: string) => {
  const [content, setContent] = React.useState<ContentItem[]>([]);

  React.useEffect(() => {
    const updateContent = () => {
      if (type) {
        setContent(contentManager.getContentByType(type, language));
      } else {
        setContent(contentManager.getAllContent());
      }
    };

    updateContent();
    const unsubscribe = contentManager.subscribe(updateContent);

    return unsubscribe;
  }, [type, language]);

  return content;
};

export const useServices = (language?: string) => {
  const [services, setServices] = React.useState<ServiceContent[]>([]);

  React.useEffect(() => {
    const updateServices = () => {
      setServices(contentManager.getServices(language));
    };

    updateServices();
    const unsubscribe = contentManager.subscribe(updateServices);

    return unsubscribe;
  }, [language]);

  return services;
};

export const useTestimonials = (language?: string, limit?: number) => {
  const [testimonials, setTestimonials] = React.useState<TestimonialContent[]>([]);

  React.useEffect(() => {
    const updateTestimonials = () => {
      setTestimonials(contentManager.getTestimonials(language, limit));
    };

    updateTestimonials();
    const unsubscribe = contentManager.subscribe(updateTestimonials);

    return unsubscribe;
  }, [language, limit]);

  return testimonials;
};

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = React.useState<ContentItem[]>([]);

  React.useEffect(() => {
    const updateAnnouncements = () => {
      setAnnouncements(contentManager.getActiveAnnouncements());
    };

    updateAnnouncements();
    const unsubscribe = contentManager.subscribe(updateAnnouncements);

    return unsubscribe;
  }, []);

  return announcements;
};
