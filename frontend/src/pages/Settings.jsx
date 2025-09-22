import React, { useState } from 'react'
import { Link2, Shield, Zap, CheckCircle, X } from 'lucide-react'
import Button from '../components/UI/Button'
import Card from '../components/UI/Card'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('integrations')
  const [integrationStatus, setIntegrationStatus] = useState({
    jira: true,
    azure: false,
    polarion: false
  })

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'ai', label: 'AI Settings', icon: Zap }
  ]

  const toggleIntegration = (integration) => {
    setIntegrationStatus(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }))
  }

  return (
    <div className="settings fade-in">
      <div className="settings__header">
        <h1>Settings</h1>
        <p>Configure integrations, compliance standards, and AI preferences</p>
      </div>

      <div className="settings__container">
        <Card className="settings__nav" padding="medium">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-tab ${activeTab === id ? 'nav-tab--active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </Card>

        <Card className="settings__content" padding="large">
          {activeTab === 'integrations' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>ALM Tool Integrations</h2>
                <p>Connect with your Application Lifecycle Management tools</p>
              </div>

              <div className="integration-cards">
                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-info">
                      <h3>Jira</h3>
                      <p>Sync test cases with Jira tickets and requirements</p>
                    </div>
                    <div className="integration-status">
                      {integrationStatus.jira ? (
                        <span className="status-badge status-badge--connected">
                          <CheckCircle size={14} />
                          Connected
                        </span>
                      ) : (
                        <span className="status-badge status-badge--disconnected">
                          <X size={14} />
                          Disconnected
                        </span>
                      )}
                    </div>
                  </div>

                  {integrationStatus.jira && (
                    <div className="integration-config">
                      <div className="config-item">
                        <label>Server URL</label>
                        <input type="text" value="https://company.atlassian.net" readOnly />
                      </div>
                      <div className="config-item">
                        <label>Project Key</label>
                        <input type="text" value="HEALTH" readOnly />
                      </div>
                      <div className="config-item">
                        <label>Authentication</label>
                        <input type="password" value="••••••••••••" readOnly />
                      </div>
                    </div>
                  )}

                  <div className="integration-actions">
                    {integrationStatus.jira ? (
                      <>
                        <Button variant="secondary" size="small">
                          Configure
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => toggleIntegration('jira')}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={() => toggleIntegration('jira')}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>

                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-info">
                      <h3>Azure DevOps</h3>
                      <p>Integrate with Azure DevOps work items and test plans</p>
                    </div>
                    <div className="integration-status">
                      <span className="status-badge status-badge--disconnected">
                        <X size={14} />
                        Not Connected
                      </span>
                    </div>
                  </div>
                  <div className="integration-actions">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => toggleIntegration('azure')}
                    >
                      Connect
                    </Button>
                  </div>
                </div>

                <div className="integration-card">
                  <div className="integration-header">
                    <div className="integration-info">
                      <h3>Polarion</h3>
                      <p>Sync with Polarion requirements and test management</p>
                    </div>
                    <div className="integration-status">
                      <span className="status-badge status-badge--disconnected">
                        <X size={14} />
                        Not Connected
                      </span>
                    </div>
                  </div>
                  <div className="integration-actions">
                    <Button 
                      variant="primary" 
                      size="small"
                      onClick={() => toggleIntegration('polarion')}
                    >
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Compliance Standards</h2>
                <p>Configure healthcare compliance requirements and standards</p>
              </div>

              <div className="compliance-settings">
                <div className="compliance-group">
                  <h3>Active Standards</h3>
                  <div className="standards-list">
                    {[
                      {
                        id: 'fda-cfr-820',
                        name: 'FDA 21 CFR Part 820',
                        description: 'Quality System Regulation for Medical Devices',
                        enabled: true
                      },
                      {
                        id: 'iec-62304',
                        name: 'IEC 62304',
                        description: 'Medical Device Software Lifecycle Processes',
                        enabled: true
                      },
                      {
                        id: 'iso-13485',
                        name: 'ISO 13485',
                        description: 'Medical Device Quality Management Systems',
                        enabled: true
                      },
                      {
                        id: 'iso-27001',
                        name: 'ISO 27001',
                        description: 'Information Security Management',
                        enabled: false
                      },
                      {
                        id: 'hipaa',
                        name: 'HIPAA',
                        description: 'Health Insurance Portability and Accountability Act',
                        enabled: false
                      }
                    ].map((standard) => (
                      <label key={standard.id} className="standard-item">
                        <input 
                          type="checkbox" 
                          defaultChecked={standard.enabled}
                        />
                        <div className="standard-info">
                          <strong>{standard.name}</strong>
                          <span>{standard.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="compliance-group">
                  <h3>Validation Settings</h3>
                  <div className="validation-options">
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Require traceability mapping for all test cases</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Validate compliance coverage before approval</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" />
                      <span>Auto-generate compliance reports</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Include regulatory context in test cases</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>AI Generation Settings</h2>
                <p>Configure AI behavior for test case generation</p>
              </div>

              <div className="ai-settings">
                <div className="setting-group">
                  <h3>Generation Preferences</h3>
                  <div className="setting-item">
                    <label htmlFor="default-priority">Default Test Case Priority</label>
                    <select id="default-priority" defaultValue="medium">
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <label htmlFor="complexity-level">Test Case Complexity Level</label>
                    <select id="complexity-level" defaultValue="balanced">
                      <option value="simple">Simple - Basic scenarios only</option>
                      <option value="balanced">Balanced - Mix of simple and complex</option>
                      <option value="comprehensive">Comprehensive - Include edge cases</option>
                    </select>
                  </div>

                  <div className="setting-item">
                    <label htmlFor="max-tests">Maximum Test Cases per Document</label>
                    <input 
                      type="number" 
                      id="max-tests"
                      defaultValue="50" 
                      min="10" 
                      max="200" 
                    />
                  </div>

                  <div className="setting-item">
                    <label htmlFor="generation-timeout">Generation Timeout (minutes)</label>
                    <input 
                      type="number" 
                      id="generation-timeout"
                      defaultValue="10" 
                      min="5" 
                      max="30" 
                    />
                  </div>
                </div>

                <div className="setting-group">
                  <h3>AI Model Configuration</h3>
                  <div className="model-settings">
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Use domain-specific healthcare vocabulary</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Include regulatory context in generation</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" />
                      <span>Generate test data examples</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" />
                      <span>Include negative test scenarios</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Auto-generate traceability links</span>
                    </label>
                  </div>
                </div>

                <div className="setting-group">
                  <h3>Quality Assurance</h3>
                  <div className="qa-settings">
                    <div className="setting-item">
                      <label htmlFor="compliance-score">Minimum Compliance Score (%)</label>
                      <div className="slider-container">
                        <input 
                          type="range" 
                          id="compliance-score"
                          min="60" 
                          max="100" 
                          defaultValue="85" 
                        />
                        <span className="slider-value">85%</span>
                      </div>
                    </div>
                    <label className="option-item">
                      <input type="checkbox" defaultChecked />
                      <span>Review generated test cases before saving</span>
                    </label>
                    <label className="option-item">
                      <input type="checkbox" />
                      <span>Auto-approve test cases above quality threshold</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <Button variant="secondary">
              Reset to Defaults
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
